from mysql.connector.pooling import MySQLConnectionPool
from flask import *
from flask_cors import CORS
app=Flask(__name__)
CORS(app)
app.secret_key='something secret'
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

dbconfig={
	'host':'localhost',
	'user':'root',
	'password':'jason9987',
	'database':'travel',
}
pool=MySQLConnectionPool(
	pool_name='mypool',
	pool_size=30,
	**dbconfig
)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route('/api/user', methods=['GET'])
def getUser():
	id,name,email="","",""
	if('login-id' in session):
		id=session['login-id']
	if('login-name' in session):
		name=session['login-name']
	if('login-email' in session):
		email=session['login-email']
	value=(id,name,email)
	db=pool.get_connection()
	cursor=db.cursor(dictionary=True)
	sql='SELECT id,name,email FROM member WHERE id=%s AND name=%s AND email=%s'
	cursor.execute(sql,value)
	output=cursor.fetchone()
	cursor.close()
	db.close()
	if(output is not None):
		data={
			'id':output['id'],
			'name':output['name'],
			'email':output['email'],
		}
	else:
		data=output
	return jsonify({'data':data})

@app.route('/api/user', methods=['POST'])
def signUp():
	try:
		data=request.get_json(silent=True)
		# print(data)
		name=data['name']
		email=data['email']
		password=data['password']
		value=(email,)
		db=pool.get_connection()
		cursor=db.cursor(dictionary=True)
		sql='SELECT email FROM member WHERE email=%s'
		cursor.execute(sql,value)
		output=cursor.fetchone()
		# print(output)
		cursor.close()
		db.close()
		if(output is not None):
			return Response('{"error":true, "message":"註冊失敗，重複的 Email 或其他原因"}', status=400, mimetype='application/json')
		else:
			value=(name,email,password)
			db=pool.get_connection()
			cursor=db.cursor(dictionary=True)
			sql='INSERT INTO member (name, email, password) VALUES (%s, %s, %s)'
			cursor.execute(sql,value)
			db.commit()
			cursor.close()
			db.close()
			return Response('{"ok":true}', status=200, mimetype='application/json')
	except:
		return Response('{"error":true, "message":"伺服器內部錯誤"}', status=500, mimetype='application/json')

@app.route('/api/user', methods=['PATCH'])
def logIn():
	try:
		data=request.get_json(silent=True)
		# print(data)
		email=data['email']
		password=data['password']
		value=(email,password)
		db=pool.get_connection()
		cursor=db.cursor(dictionary=True)
		sql='SELECT id,name,email,password FROM member WHERE email=%s AND password=%s'
		cursor.execute(sql,value)
		output=cursor.fetchone()
		# print(output)
		cursor.close()
		db.close()
		if(output is None):
			return Response('{"error":true, "message":"登入失敗，帳號或密碼錯誤或其他原因"}', status=400, mimetype='application/json')
		else:
			session['login-id']=output['id']
			session['login-name']=output['name']
			session['login-email']=output['email']
			# print(session['login-id'])
			# print(session['login-name'])
			# print(session['login-email'])
			return Response('{"ok":true}', status=200, mimetype='application/json')
	except:
		return Response('{"error":true, "message":"伺服器內部錯誤"}', status=500, mimetype='application/json')

@app.route('/api/user', methods=['DELETE'])
def logOut():
	session.pop('login-id', None)
	session.pop('login-name', None)
	session.pop('login-email', None)
	return Response('{"ok":true}', status=200, mimetype='application/json')

@app.route('/api/attractions', methods=['GET'])
def api():
	try:
		input=(request.args.get('page'),)
		if input[0] is None:
			page=(0,)
		else:
			page=(int(input[0]),)
		
		keyword=(request.args.get('keyword'),)
		if keyword[0] is None:
			db1=pool.get_connection()
			c1=db1.cursor(dictionary=True)
			sql1='SELECT id,name,category,description,address,transport,mrt,latitude,longitude FROM spot LIMIT %s, 12'
			c1.execute(sql1,(12*page[0],))
			output=c1.fetchall()
			c1.close()
			db1.close()
		else:
			db2=pool.get_connection()
			c2=db2.cursor(dictionary=True)
			sql2='SELECT id,name,category,description,address,transport,mrt,latitude,longitude FROM spot WHERE name LIKE %s LIMIT %s, 12'
			c2.execute(sql2,("%"+keyword[0]+"%",12*page[0]))
			output=c2.fetchall()
			c2.close()
			db2.close()

		length=len(output)
		imgLinks=[]
		dataFinal=[]
		for i in range(length):
			imgLink=[]
			id=output[i]['id']
			db3=pool.get_connection()
			c3=db3.cursor(dictionary=True)
			sql3='SELECT images FROM image WHERE spot_id=%s'
			c3.execute(sql3,(id,))
			link=c3.fetchall()
			c3.close()
			db3.close()
			for x in link:
				img=x['images']
				imgLink.append(img)
			imgLinks.append(imgLink)

			data={
				'id':output[i]['id'],
				'name':output[i]['name'],
				'category':output[i]['category'],
				'description':output[i]['description'],
				'address':output[i]['address'],
				'transport':output[i]['transport'],
				'mrt':output[i]['mrt'],
				'latitude':float(output[i]['latitude']),
				'longitude':float(output[i]['longitude']),
				'images':imgLinks[i]
			}
			dataFinal.append(data)
		
		if(len(output)+1>=13):
			num=page[0]+1
		else:
			num=None
		return jsonify({'nextPage':num, 'data':dataFinal})

	except ValueError:
		return Response('{"error":True, "message":"404 錯誤訊息"}', status=404, mimetype='application/json')

	except:
		return Response('{"error":True, "message":"500 錯誤訊息"}', status=500, mimetype='application/json')

@app.route('/api/attraction/<path>', methods=['GET'])
def api_attraction_id(path):
	try:
		path=int(path)
		db4=pool.get_connection()
		c4=db4.cursor(dictionary=True)
		sql4='SELECT id,name,category,description,address,transport,mrt,latitude,longitude FROM spot WHERE id=%s'
		c4.execute(sql4,(path,))
		output=c4.fetchone()
		c4.close()
		db4.close()

		imgLinks=[]
		imgLink=[]
		id=output['id']
		db5=pool.get_connection()
		c5=db5.cursor(dictionary=True)
		sql5='SELECT images FROM image WHERE spot_id=%s'
		c5.execute(sql5,(id,))
		link=c5.fetchall()
		c5.close()
		for y in link:
			img=y['images']
			imgLink.append(img)
		imgLinks.append(imgLink)

		dataFinal=[]
		data={
			'id':output['id'],
			'name':output['name'],
			'category':output['category'],
			'description':output['description'],
			'address':output['address'],
			'transport':output['transport'],
			'mrt':output['mrt'],
			'latitude':float(output['latitude']),
			'longitude':float(output['longitude']),
			'images':imgLinks[0]
		}
		dataFinal.append(data)
		return jsonify({'data':dataFinal[0]})

	except ValueError:
		return Response('{"error":True, "message":"400 錯誤訊息"}', status=400, mimetype='application/json')
	
	except:
		return Response('{"error":True, "message":"500 錯誤訊息"}', status=500, mimetype='application/json')

@app.route('/api/booking', methods=['GET'])
def getBooking():
	# id,name,email="","",""
	if('login-email' in session):
		email=session['login-email']
		value=(email,)
		db=pool.get_connection()
		cursor=db.cursor(dictionary=True)
		sql='SELECT attraction_id,date,time,price FROM booking WHERE user_email=%s'
		cursor.execute(sql,value)
		output1=cursor.fetchone()
		cursor.close()
		db.close()
		if(output1 is not None):
			a_id=output1['attraction_id']
			value=(a_id,)
			db=pool.get_connection()
			cursor=db.cursor(dictionary=True)
			sql='''SELECT id,name,address,images 
					FROM spot LEFT JOIN image
					ON spot.id=image.spot_id
					HAVING spot.id=%s
					LIMIT 1'''
			cursor.execute(sql,value)
			output2=cursor.fetchone()
			cursor.close()
			db.close()

			data={
				'attraction':{
				'id':output2['id'],
				'name':output2['name'],
				'address':output2['address'],
				'image':output2['images']
				},
				'date':output1['date'],
				'time':output1['time'],
				'price':output1['price']
			}
		else:
			data=None
		return jsonify({'data':data})
	else:
		return Response('{"error":true, "message":"未登入系統，拒絕存取"}', status=403, mimetype='application/json')

@app.route('/api/booking', methods=['POST'])
def addBooking():
	try:
		# email=""
		if('login-email' in session):
			email=session['login-email']
			data=request.get_json(silent=True)
			print(data)
			attractionId=int(data['attractionId'])
			date=data['date']
			time=data['time']
			price=int(data['price'])
			if(date==""):
				return Response('{"error":true, "message":"建立失敗，輸入不正確或其他原因"}', status=400, mimetype='application/json')
			else:
				value1=(email,)
				db=pool.get_connection()
				cursor=db.cursor(dictionary=True)
				sql='DELETE FROM booking WHERE user_email=%s'
				cursor.execute(sql,value1)
				db.commit()
				cursor.close()
				db.close()
				value2=(email,attractionId,date,time,price)
				db=pool.get_connection()
				cursor=db.cursor(dictionary=True)
				sql='INSERT INTO booking (user_email,attraction_id,date,time,price) VALUES (%s,%s,%s,%s,%s)'
				cursor.execute(sql,value2)
				db.commit()
				cursor.close()
				db.close()
				return Response('{"ok":true}', status=200, mimetype='application/json')
		else:
			return Response('{"error":true, "message":"未登入系統，拒絕存取"}', status=403, mimetype='application/json')

	except:
		return Response('{"error":true, "message":"伺服器內部錯誤"}', status=500, mimetype='application/json')

@app.route('/api/booking', methods=['DELETE'])
def dropBooking():
	if('login-email' in session):
		email=session['login-email']
		value=(email,)
		db=pool.get_connection()
		cursor=db.cursor(dictionary=True)
		sql='DELETE FROM booking WHERE user_email=%s'
		cursor.execute(sql,value)
		db.commit()
		cursor.close()
		db.close()
		return Response('{"ok":true}', status=200, mimetype='application/json')
	else:
		return Response('{"error":true, "message":"未登入系統，拒絕存取"}', status=403, mimetype='application/json')

if __name__=="__main__":
	app.run(host='0.0.0.0',port=3000)
# app.run(debug=True,port=3000)
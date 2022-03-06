from flask import Response
from mysql.connector.pooling import MySQLConnectionPool
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

from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

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
		return Response("{'error':True, 'message':'404 錯誤訊息'}", status=404, mimetype='application/json')

	except:
		return Response("{'error':True, 'message':'500 錯誤訊息'}", status=500, mimetype='application/json')

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
		return Response("{'error':True, 'message':'400 錯誤訊息'}", status=400, mimetype='application/json')
	
	except:
		return Response("{'error':True, 'message':'500 錯誤訊息'}", status=500, mimetype='application/json')

app.run(host='0.0.0.0',port=3000)
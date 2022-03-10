import json
import mysql.connector
db=mysql.connector.connect(
    host='localhost',
    user='root',
    password='jason9987',
    database='travel'
)

with open('taipei-attractions.json','r',encoding='utf8') as fr:
    rawData=json.load(fr)
    length=len(rawData['result']['results'])
    # print(length)
    for i in range(length):
        info=rawData['result']['results'][i]['info']
        stitle=rawData['result']['results'][i]['stitle']
        xpostDate=rawData['result']['results'][i]['xpostDate']
        longitude=rawData['result']['results'][i]['longitude']
        ref_wp=rawData['result']['results'][i]['REF_WP']
        avBegin=rawData['result']['results'][i]['avBegin']
        langinfo=rawData['result']['results'][i]['langinfo']
        mrt=rawData['result']['results'][i]['MRT']
        serial_no=rawData['result']['results'][i]['SERIAL_NO']
        row_number=rawData['result']['results'][i]['RowNumber']
        cat1=rawData['result']['results'][i]['CAT1']
        cat2=rawData['result']['results'][i]['CAT2']
        memo_time=rawData['result']['results'][i]['MEMO_TIME']
        poi=rawData['result']['results'][i]['POI']
        idpt=rawData['result']['results'][i]['idpt']
        latitude=rawData['result']['results'][i]['latitude']
        xbody=rawData['result']['results'][i]['xbody']
        id=i
        avEnd=rawData['result']['results'][i]['avEnd']
        address=rawData['result']['results'][i]['address']
        
        c=db.cursor()
        sql='''INSERT INTO spot (transport, name, xpostDate, longitude, REF_WP, avBegin, 
                langinfo, mrt, SERIAL_NO, RowNumber, CAT1, category, 
                MEMO_TIME, POI, idpt, latitude, description, id, avEnd, address) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
        val=(info, stitle, xpostDate, longitude, ref_wp, avBegin, 
            langinfo, mrt, serial_no, row_number, cat1, cat2, 
            memo_time, poi, idpt, latitude, xbody, id, avEnd, address)
        c.execute(sql,val)
        db.commit()

    imageLink=[]
    for i in range(length):
        for j in range(i,i+1):
            image=[]
            filter=rawData['result']['results'][i]['file'].split('https')
            for x in filter:
                if(x[-3:]=='jpg') or (x[-3:]=='JPG') or (x[-3:]=='png') or (x[-3:]=='PNG'):
                    img='https'+x
                    # print(img)
                    image.append(img)
            imageLink.append(image)
        # print(image)
    # print(imageLink[1][0])

    for i in range(length):
        for j in range(len(imageLink[i])):
            c=db.cursor()
            sql='INSERT INTO image (spot_id, images) VALUES (%s, %s)'
            val=(i, imageLink[i][j])
            c.execute(sql,val)
            db.commit()

    c.close()
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restplus import Api
from cms_api import api as cms_ns_api
from flask_cors import CORS
from werkzeug.serving import run_simple
from werkzeug.utils import cached_property

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost:3308/shopbridge'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
db.init_app(app)

class InventoryTable(db.Model):
   id = db.Column('item_id', db.Integer, primary_key = True)
   item = db.Column(db.String(100))
   price = db.Column(db.String(50))  
   description = db.Column(db.String(200))
   image = db.Column(db.String(10))

   def __init__(self, name, price, description, image):
       self.name = name
       self.price = price
       self.description = description
       self.image = image

@app.route('/insert', methods = ['POST'])
def insert():
    item_details = InventoryTable(name="array", price="hey", description="nothing", image="hello")
    db.session.add(item_details)
    db.session.commit()
    return {}

if __name__ == '__main__':
    app.run()
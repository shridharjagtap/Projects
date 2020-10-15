"""Importing database instance to create table structure model."""

from api_laucher import db
class InventoryTable(db.Model):
    """Table object model."""

    id = db.Column('item_id', db.Integer, primary_key = True)
    item = db.Column(db.String(100))
    price = db.Column(db.String(50))  
    description = db.Column(db.String(200))
    image = db.Column(db.String(10))

    def __init__(self, item, price, description, image):
        """Initialize user inputs."""
        self.item = item
        self.price = price
        self.description = description
        self.image = image
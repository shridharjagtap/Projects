"""Handler for api requests."""

import sys
import json
import logging
from flask import current_app, jsonify
from mysqlDB import InventoryTable
from api_laucher import db

logger = logging.getLogger()

class InventoryRequestHandler():
    """Api request handler class."""

    def __init__(self):
        """Create table if does not exists in database."""
        db.create_all()

    def prepare_response(self, status_code, status_message):
        """func(). will return response message."""
        logger.info("Start : preparing response on request....")
        json_data = {"status_code": status_code,
                     "status_message": status_message}
        return json_data

    def handle_get(self, item_id=None):
        """Retrive table data from database."""
        ls = []
        json_data = {}
        try:
            if item_id is None:
                logger.info("Start: Get inventory information")
                data = InventoryTable.query.all()
                for val in data:
                    dic = {}
                    dic["item"] = val.item
                    dic["price"] = val.price
                    dic["description"] = val.description
                    dic["image"] = val.image
                    dic["id"] = val.id
                    ls.append(dic)
            else:
                logger.info("Start: Get inventory item details")
                data = InventoryTable.query.filter(InventoryTable.id==item_id)
                for val in data:
                    dic = {}
                    dic["item"] = val.item
                    dic["price"] = val.price
                    dic["description"] = val.description
                    dic["image"] = val.image
                    dic["id"] = val.id
                    ls.append(dic)
            jsonData = self.prepare_response("200", "Success")
            jsonData['data'] = ls
        except Exception as e:
            logger.error(e)
            jsonData = self.prepare_response("404", "Failed")
            jsonData['data'] = ls
        logger.debug("Response: {}".format(json_data))
        logger.info("End: Get inventory process")
        return jsonData

    def handle_put(self, _json_data):
        """Add new item entry in inventory."""
        logger.info("Start: Create inventory entry in database")
        logger.debug("Request json: {}".format(_json_data))
        ls = []
        try:
            for key, value in _json_data.items():
                ls.append(value)
            item_details = InventoryTable(*ls)
            db.session.add(item_details)
            db.session.commit()
        except Exception as e:
            logger.error(e)
            return self.prepare_response("404", "Failed")
        logger.info("End: Create inventory entry in database")
        return self.prepare_response("200", "Success")

    def handle_patch(self, item_id, _json_data):
        """Update existing item details."""
        logger.info("Start: Update invetory item details of id: {}".format(item_id))
        logger.debug("Request json: {}".format(_json_data))
        try:
            db.session.query(InventoryTable).filter(InventoryTable.id==item_id).update(_json_data)
            db.session.commit()
        except Exception as e:
            logger.error(e)
            return self.prepare_response("404", "Failed")
        logger.info("End: Update invetory item details of id: {}".format(item_id))
        return self.prepare_response("200", "Success")

    def handle_delete(self, item_id):
        """Delete existing item details."""
        logger.info("Start: delete ineventory item details of item id: {}".format(item_id))
        try:
            db.session.query(InventoryTable).filter(InventoryTable.id==item_id).delete()
            db.session.commit()
        except Exception as e:
            logger.error(e)
            return self.prepare_response("404", "Failed")
        logger.info("End: delete ineventory item details of item id: {}".format(item_id))
        return self.prepare_response("200", "Success")
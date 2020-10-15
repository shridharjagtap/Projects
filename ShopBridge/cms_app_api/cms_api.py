"""ShopBridge api's.

For Insert | Update | Delete | Get operation
"""

import flask
import logging
from flask_restplus import fields, Resource
from api_namespace import api
from request_handler import InventoryRequestHandler

get_response_model = api.model('Inventory Api Get response', 
                                {'status_code': fields.String(required=True, description='Status Code'),
                                 'status_message': fields.String(required=True, description='Status Message'),
                                 'data': fields.Raw(required=True, description='Json Data')})


update_request_model = api.model('Add inventory Api', 
                                {'item': fields.String(required=True, description='Item name'),
                                 'price': fields.String(required=True, description='Item price'),
                                 'description': fields.String(required=True, description='Item description'),
                                 'image': fields.String(required=True, description='Item image')})


response_model = api.model(' Put | Update | Delete response', 
                                {'status_code': fields.String(required=True, description='Status Code'),
                                 'status_message': fields.String(required=True, description='Status Message')})

logger = logging.getLogger()


@api.route('/inventory')
@api.header('X-Frame-Options', 'sameorigin')
@api.header('Cache-Control', 'no-cache')
class InventoryApi(Resource):
    """Api for inventory management."""

    def __init__(self, api_):
        """Initialize request handler."""
        self.api = api_
        self._handler = InventoryRequestHandler()


    @api.marshal_with(get_response_model)
    def get(self):
        """Get inventory."""
        logger.debug("{}.get() for inventory details".format(self.__class__.__name__))
        return self._handler.handle_get()


    @api.expect(update_request_model)
    @api.marshal_with(response_model)
    def put(self):
        """Update or add inverntory item."""
        logger.debug("{}.put() for inventory".format(self.__class__.__name__))
        return self._handler.handle_put(api.payload)



@api.route('/inventory/<id>')
@api.param('id', 'Id')
@api.header('X-Frame-Options', 'sameorigin')
@api.header('Cache-Control', 'no-cache')
class InventoryUpdateApi(Resource):
    """Api for inventory management."""

    def __init__(self, api_):
        """Initialize request handler."""
        self.api = api_
        self._handler = InventoryRequestHandler()


    @api.marshal_with(get_response_model)
    def get(self, id):
        """Get item details."""
        logger.debug("{}.get() for inventory item details".format(self.__class__.__name__))
        return self._handler.handle_get(id)


    @api.expect(update_request_model)
    @api.marshal_with(response_model)
    def patch(self, id):
        """Update inventory item."""
        logger.debug("{}.patch() for item id: {}".format(self.__class__.__name__, id))
        return self._handler.handle_patch(id, api.payload)


    @api.marshal_with(response_model)
    def delete(self, id):
        """Delete inventory item."""
        logger.debug("{}.delete() for inventory item id: {}".format(self.__class__.__name__, id))
        return self._handler.handle_delete(id)

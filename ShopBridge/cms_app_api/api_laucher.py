"""flask api server launcher script."""

#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from flask import Flask
import argparse
import logging
import sys
from flask_sqlalchemy import SQLAlchemy
from flask_restplus import Api
from cms_api import api as cms_ns_api
from flask_cors import CORS
from werkzeug.serving import run_simple
from werkzeug.utils import cached_property

PROG = 'InventoryManagement'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost:3308/shopbridge'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
db.init_app(app)

# Initialize logging
logger = logging.getLogger(PROG)
f = logging.Formatter()
h = logging.StreamHandler(sys.stdout)
h.setFormatter(f)
logger.addHandler(h)

class Inventory:
    """This will start WSGI server."""

    def __init__(self):
        """Initialize api attributes."""
        self._api = Api(version='1.0', title='Inventory Management Api',
                        description='Inventory Management Api is used to Mannage inventory details.')
        self._api.add_namespace(cms_ns_api)


    def start(self, _port):
        """Start WSGI server."""
        logger.debug("Starting...{}".format(PROG))
        self._api.init_app(app)
        CORS(app)
        run_simple('localhost', _port, app, use_reloader=True)


if __name__ == '__main__':

    # sanity checks
    def portType(value):
        """Validate user input port."""
        if int(value) <= 0:
            raise argparse.ArgumentTypeError("Invalid port: " + str(value))
        return value

    ap = argparse.ArgumentParser(description='Inventory Api Parameters', formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument('--port', metavar='PORT', type=portType, dest='inventory_api_port', default=8080)
    ap.add_argument("--debug", action="store_true",
                        dest="debug", default=False,
                        help="enable debug logs")

    args = ap.parse_args()

    if args.debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    invApi = Inventory()
    exit_code = 0
    try:
        invApi.start(int(args.inventory_api_port))
    except Exception as e:
        logger.info(e)
        exit_code = 1
    finally:
        sys.exit(exit_code)


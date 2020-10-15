from enum import Enum


class Constants:
    pass


class InventoryActions(Enum):
    GET_INVENTORY_DETAILS = 'GetInventoryDetails'
    GET_ITEM_DETAILS = 'GetItemDetails'
    PUT_ITEM_DETAILS = 'PutItemDetails'
    DELETE_ITEM_DETAILS = 'DeleteItemDetails'

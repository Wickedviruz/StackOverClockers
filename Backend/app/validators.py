# app/validators.py
from marshmallow import Schema, fields, validate

class CategorySchema(Schema):
        name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=100),  # Exempel: Längd mellan 1 och 100 tecken
        error_messages={
            "required": "Category name is required.",
            "null": "Category name cannot be null.",
            "validator_failed": "Category name must be between 1 and 100 characters."
        }
    )

class SubcategorySchema(Schema):
    name = fields.String(
        required=True,
        validate=lambda x: len(x.strip()) > 0,
        error_messages={
            "required": "Subcategory name is required.",
            "null": "Subcategory name cannot be null.",
            "validator_failed": "Subcategory name cannot be empty."
        }
    )

class ThreadSchema(Schema):
    title = fields.String(
        required=True,
        validate=validate.Length(min=1, max=200),
        error_messages={
            "required": "Title is required.",
            "null": "Title cannot be null.",
            "validator_failed": "Title must be between 1 and 200 characters."
        }
    )
    content = fields.String(
        required=True,
        validate=validate.Length(min=10),
        error_messages={
            "required": "Content is required.",
            "null": "Content cannot be null.",
            "validator_failed": "Content must be at least 10 characters long."
        }
    )
    subcategory_id = fields.Integer(
        required=True,
        error_messages={
            "required": "Subcategory ID is required.",
            "null": "Subcategory ID cannot be null."
        }
    )

class CommentSchema(Schema):
    content = fields.String(
        required=True,
        validate=validate.Length(min=10, max=1000),
        error_messages={
            "required": "Comment content is required.",
            "null": "Comment content cannot be null.",
            "validator_failed": "Comment content must be between 10 and 1000 characters."
        }
    )


class SnippetsSchema(Schema):
    content = fields.String(
        required=True,
        validate=validate.Length(min=10, max=1000),
        error_messages={
            "required": "Comment content is required.",
            "null": "Comment content cannot be null.",
            "validator_failed": "Comment content must be between 10 and 1000 characters."
        }
    )


def validate_registration(data):
    errors = {}
    if not data.get('username'):
        errors['username'] = 'Username is required.'
    if not data.get('email'):
        errors['email'] = 'Email is required.'
    if not data.get('password') or len(data['password']) < 8:
        errors['password'] = 'Password must be at least 8 characters long.'
    if not data.get('accepted_privacy_policy'):
        errors['accepted_privacy_policy'] = 'Privacy policy must be accepted.'
    return errors

def validate_login(data):
    errors = {}
    if not data.get('username'):
        errors['username'] = 'Username is required.'
    if not data.get('password'):
        errors['password'] = 'Password is required.'
    return errors

// 数据库表
var db = {
    post: {
        id: {
            type: 'increments',
            nullable: false,
            primary: true
        },
        uuid: {
            type: 'string',
            maxlength: 36,
            nullable: false,
            validations: {
                'isUUID': {
                    condition: true,
                    errorInfo: 'UUID is invalid.'
                }
            },
            autocompletions: {
                'uuid': {
                    autocompleteOn: 'add'
                }
            }
        },
        title: {
            type: 'string',
            maxlength: 128,
            nullable: false,
            validations: {
                'empty': {
                    condition: false,
                    errorInfo: 'Title must not be empty.',
                }
            }
        },
        content: {
            type: 'text',
            maxlength: 16777215,
            fieldtype: 'mediumtext',
            nullable: true
        },
        author_id: {
            type: 'integer',
            nullable: false,
            autocompletions: {
                'getCurrentUserId': {
                    autocompleteOn: 'add'
                }
            }
        },
        status: {
            type: 'bool',
            nullable: false,
            defaultTo: false
        },
        created_at: {
            type: 'integer',
            nullable: false,
            autocompletions: {
                'timestamp': {
                    autocompleteOn: 'add'
                }
            }
        },
        updated_at: {
            type: 'integer',
            nullable: false,
            autocompletions: {
                'timestamp': { }
            }
        }
    }
};

module.exports.tables = db;

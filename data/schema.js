
// 数据库表
var db = {
    posts: {
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
            }
        },
        title: {
            type: 'string',
            maxlength: 255,
            nullable: false,
            validations: {
                'empty': {
                    condition: false,
                    errorInfo: 'Title must not be empty.',
                }
            },
            autocompletions: {
                'timestamp': {
                    autocompleteOn: 'add'
                },
                'concat': {
                    arguments: 'easy'
                }
            }
        },
        content: {
            type: 'text',
            maxlength: 16777215,
            fieldtype: 'medium',
            nullable: true
        },
        author_id: {
            type: 'integer',
            nullable: false
        },
        created_at: {
            type: 'dateTime',
            nullable: false,
            autocompletions: {
                'timestamp': {
                    autocompleteOn: 'add'
                }
            }
        },
        updated_at: {
            type: 'dateTime',
            nullable: true,
            autocompletions: {
                'timestamp': { }
            }
        }
    }
};

module.exports.tables = db;

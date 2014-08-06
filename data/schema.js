
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
                'empty': {
                    condition: false,
                    errorInfo: 'UUID not be empty'
                },
                'isUUID': {
                    condition: true,
                    errorInfo: 'UUID is invalid!'
                }
            }
        },
        title: {
            type: 'string',
            maxlength: 255,
            nullable: true,
            validations: {
                'empty': {
                    condition: false,
                    errorInfo: 'title不能为空',
                    validateOn: 'add'
                }
            }
        },
        slug: {
            type: 'string',
            maxlength: 150,
            nullable: false,
            unique: true
        },
        content: {
            type: 'text',
            maxlength: 16777215,
            fieldtype: 'medium',
            nullable: true
        },
        image: {
            type: 'text',
            maxlength: 2000,
            nullable: true
        },
        featured: {
            type: 'bool',
            nullable: false,
            defaultTo: false,
            validations: {
                'isIn': {
                    condition: [[0, 1, false, true]],
                    errorInfo: 'Featured is invalid!'
                }
            }
        },
        page: {
            type: 'bool',
            nullable: false,
            defaultTo: false,
            validations: {
                'isIn': {
                    condition: [[0, 1, false, true]],
                    errorInfo: 'page is invalid!'
                }
            }
        },
        status: {
            type: 'string',
            maxlength: 150,
            nullable: false,
            defaultTo: 'draft'
        },
        author_id: {
            type: 'integer',
            nullable: false
        },
        created_at: {
            type: 'dateTime',
            nullable: false
        },
        updated_at: {
            type: 'dateTime',
            nullable: true
        }
    }
};

module.exports.tables = db;

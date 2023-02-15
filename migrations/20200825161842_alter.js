const formatAlterTableEnumSql = (
    tableName,
    columnName,
    enums,
) => {
    const constraintName = `${tableName}_${columnName}_check`;
    return `ALTER TABLE chat MODIFY COLUMN type ENUM('text','image','logistic','invoice','tracker','purchase','estimate','comment','price','general','description')`;
};

exports.up = async function up(knex) {
    await knex.raw(
        formatAlterTableEnumSql('chat', 'type', [
            'general',
            'description',            
        ])
    );
};

exports.down = async function down(knex) {
    await knex.raw(
        formatAlterTableEnumSql('chat', 'type', [
            'general',
            'description',
        ])
    );
};
import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export default class AddForeignKeyInTransactions1599400716414
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'CategoryOfTransaction',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'CategoryOfTransaction');

    await queryRunner.dropColumn('transactions', 'category_id');

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category',
        type: 'varchar',
      }),
    );
  }
}

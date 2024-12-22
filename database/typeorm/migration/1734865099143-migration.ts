import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734865099143 implements MigrationInterface {
    name = 'Migration1734865099143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "refundTransactionId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "refundTransactionId"`);
    }

}

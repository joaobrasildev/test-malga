import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734778125848 implements MigrationInterface {
    name = 'Migration1734778125848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "externalTransactionId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "externalTransactionId"`);
    }

}

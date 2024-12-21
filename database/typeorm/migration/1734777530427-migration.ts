import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734777530427 implements MigrationInterface {
    name = 'Migration1734777530427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."typeDetail" RENAME TO "typeDetail_old"`);
        await queryRunner.query(`CREATE TYPE "public"."typePaymentDetail" AS ENUM('card')`);
        await queryRunner.query(`ALTER TABLE "transactionDetail" ALTER COLUMN "type" TYPE "public"."typePaymentDetail" USING "type"::"text"::"public"."typePaymentDetail"`);
        await queryRunner.query(`DROP TYPE "public"."typeDetail_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."typeDetail_old" AS ENUM('payment', 'refund')`);
        await queryRunner.query(`ALTER TABLE "transactionDetail" ALTER COLUMN "type" TYPE "public"."typeDetail_old" USING "type"::"text"::"public"."typeDetail_old"`);
        await queryRunner.query(`DROP TYPE "public"."typePaymentDetail"`);
        await queryRunner.query(`ALTER TYPE "public"."typeDetail_old" RENAME TO "typeDetail"`);
    }

}

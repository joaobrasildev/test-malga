import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734718789377 implements MigrationInterface {
    name = 'Migration1734718789377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."typeHistory" AS ENUM('payment', 'refund')`);
        await queryRunner.query(`CREATE TYPE "public"."paymentStatusHistory" AS ENUM('processing', 'processed', 'processing_failed', 'refunding', 'refunded', 'refunding_failed')`);
        await queryRunner.query(`CREATE TYPE "public"."integratorHistory" AS ENUM('Stripe', 'Braintree', 'Without integrator')`);
        await queryRunner.query(`CREATE TABLE "transactionHistory" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "transactionId" uuid NOT NULL, "paymentType" character varying NOT NULL, "type" "public"."typeHistory" NOT NULL, "status" "public"."paymentStatusHistory" NOT NULL, "statusMessage" character varying NOT NULL, "processedBy" "public"."integratorHistory" NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_47bf645e26d1473aab87042d418" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."typeDetail" AS ENUM('payment', 'refund')`);
        await queryRunner.query(`CREATE TABLE "transactionDetail" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "transactionId" uuid NOT NULL, "type" "public"."typeDetail" NOT NULL, "cardNumber" character varying, "holderName" character varying, "cvv" character varying, "expirationDate" character varying, "installments" integer, CONSTRAINT "PK_00baf82ee45728d6b550267c226" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."paymentTypeTransaction" AS ENUM('card')`);
        await queryRunner.query(`CREATE TYPE "public"."typeTransaction" AS ENUM('payment', 'refund')`);
        await queryRunner.query(`CREATE TYPE "public"."paymentStatusTransaction" AS ENUM('processing', 'processed', 'processing_failed', 'refunding', 'refunded', 'refunding_failed')`);
        await queryRunner.query(`CREATE TYPE "public"."integratorTransaction" AS ENUM('Stripe', 'Braintree', 'Without integrator')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "paymentType" "public"."paymentTypeTransaction" NOT NULL, "type" "public"."typeTransaction" NOT NULL, "status" "public"."paymentStatusTransaction" NOT NULL, "statusMessage" character varying NOT NULL, "processedBy" "public"."integratorTransaction" NOT NULL, "currency" character varying NOT NULL, "amount" integer NOT NULL, "transactionHistoryId" uuid, "transactionDetailsId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d602dd85a6c81294cd9838a3189" FOREIGN KEY ("transactionHistoryId") REFERENCES "transactionHistory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_ebed3b5ec4d207536acc0acdb85" FOREIGN KEY ("transactionDetailsId") REFERENCES "transactionDetail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ebed3b5ec4d207536acc0acdb85"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d602dd85a6c81294cd9838a3189"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."integratorTransaction"`);
        await queryRunner.query(`DROP TYPE "public"."paymentStatusTransaction"`);
        await queryRunner.query(`DROP TYPE "public"."typeTransaction"`);
        await queryRunner.query(`DROP TYPE "public"."paymentTypeTransaction"`);
        await queryRunner.query(`DROP TABLE "transactionDetail"`);
        await queryRunner.query(`DROP TYPE "public"."typeDetail"`);
        await queryRunner.query(`DROP TABLE "transactionHistory"`);
        await queryRunner.query(`DROP TYPE "public"."integratorHistory"`);
        await queryRunner.query(`DROP TYPE "public"."paymentStatusHistory"`);
        await queryRunner.query(`DROP TYPE "public"."typeHistory"`);
    }

}

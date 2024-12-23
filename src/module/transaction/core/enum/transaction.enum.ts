export enum EPaymentType {
  CARD = 'card',
}

export enum EType {
  PAYMENT = 'payment',
  REFUND = 'refund',
}

export enum ETransactionStatus {
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  PROCESSING_FAILED = 'processing_failed',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
  REFUNDING_FAILED = 'refunding_failed',
}

export enum ETransactionStatusMessage {
  PROCESSING = 'Pagamento em processamento.',
  PROCESSED = 'Pagamento processado com sucesso.',
  PROCESSING_FAILED_UNAVALABLE = 'Falha no processamento do pagamento - Integrador indisponível.',
  PROCESSING_FAILED_UNAUTHORIZED = 'Falha no processamento do pagamento - Forma de pagamento não autorizada.',
  REFUNDING = 'Estorno em processamento.',
  REFUNDED = 'Estorno processado com sucesso.',
  REFUNDING_FAILED = 'Falha no estorno - Integrador indisponível',
}

export enum EIntegrator {
  STRIPE = 'Stripe',
  BRAINTREE = 'Braintree',
  NO_INTEGRATOR = 'Without integrator',
}

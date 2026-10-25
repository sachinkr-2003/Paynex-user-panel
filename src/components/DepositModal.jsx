import UpiPaymentGateway from './UpiPaymentGateway';

// Delegate all deposit requests to the customized custom UPI Payment Gateway
const DepositModal = ({ isOpen, onClose, onRechargeDemo, initialCompany = null }) => {
  return (
    <UpiPaymentGateway
      isOpen={isOpen}
      onClose={onClose}
      initialCompany={initialCompany}
      onRechargeSuccess={onRechargeDemo}
    />
  );
};

export default DepositModal;


/*----------------------------------------------------
To generate transactionId which is always unique
-----------------------------------------------------*/
export function generateTransactionId(): number {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000000); // Generate random number
  const transactionId = parseInt(`${year}${month}${day}${hours}${minutes}${randomNum}`);
  return transactionId;
}
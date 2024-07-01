import moment from 'moment';

export const generateReferenceID = () => {
  const timePart = moment().format('HHss');
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `AK-${timePart}-${randomPart}`;
};

export const generateRandomPassword = (length: number = 8) => {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
};

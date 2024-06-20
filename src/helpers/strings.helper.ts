import moment from 'moment';

export const generateReferenceID = () => {
  const timePart = moment().format('HHss');
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `AK-${timePart}-${randomPart}`;
};

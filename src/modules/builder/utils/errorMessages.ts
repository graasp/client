import axios, { AxiosError } from 'axios';

export const getErrorFromPayload = (
  inputError?: Error | AxiosError,
): { name: string; message: string } => {
  const defaultError = {
    name: 'UNEXPECTED_ERROR',
    message: 'UNEXPECTED_ERROR',
  };
  if (inputError && axios.isAxiosError(inputError)) {
    const errorData = inputError.response?.data;
    const result = { name: errorData?.name, message: errorData?.message };
    return result;
  }

  return {
    ...defaultError,
    message: inputError?.message ?? 'UNEXPECTED_ERROR',
  };
};

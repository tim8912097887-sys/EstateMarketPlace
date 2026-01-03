export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(
  apiCall: T
) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | string> => {
    try {
      return await apiCall(...args);
    } catch (error: any) {
      console.error("API Error:", error);
      return "Something went wrong";
    }
  };
};
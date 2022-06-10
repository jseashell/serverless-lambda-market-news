jest.mock('@middy/core', () => {
  return (handler) => {
    return {
      use: jest.fn().mockReturnValue(handler),
    };
  };
});

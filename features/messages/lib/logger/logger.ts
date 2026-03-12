const PREFIX = "[Messages]";

export const messagesLogger = {
  upload: (message: string, ...args: unknown[]) => {
    console.log(`${PREFIX}[Upload]`, message, ...args);
  },
  submit: (message: string, ...args: unknown[]) => {
    console.log(`${PREFIX}[Submit]`, message, ...args);
  },
  media: (message: string, ...args: unknown[]) => {
    console.log(`${PREFIX}[Media]`, message, ...args);
  },
};

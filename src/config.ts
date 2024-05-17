interface ENV {
  JWT_SECRET: string;
}

export const Env: ENV = {
  JWT_SECRET: process.env.JWT_SECRET!,
};

interface ENV {
  JWT_SECRET: string;
  FRONTEND_LINK: string;
}

export const Env: ENV = {
  JWT_SECRET: process.env.JWT_SECRET!,
  FRONTEND_LINK: process.env.FRONTEND_LINK!,
};

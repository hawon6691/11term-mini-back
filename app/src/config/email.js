"use strict";

const SMTP_CONFIGS = {
  gmail: {
    service: "gmail",
  },
  naver: {
    host: "smtp.naver.com",
    port: 465,
    secure: true,
  },
};

module.exports = {
  service: process.env.EMAIL_SERVICE || "gmail",

  getSmtpConfig() {
    const serviceType = this.service.toLowerCase();
    return SMTP_CONFIGS[serviceType] || SMTP_CONFIGS.gmail;
  },

  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  from: process.env.EMAIL_FROM || "ClubService",
};

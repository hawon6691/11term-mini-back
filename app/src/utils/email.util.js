"use strict";

const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");

const createTransporter = () => {
  const smtpConfig = emailConfig.getSmtpConfig();

  if (emailConfig.service.toLowerCase() === "gmail") {
    return nodemailer.createTransport({
      service: smtpConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
};

const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${emailConfig.baseUrl}/reset-password/${token}`;

    const mailOptions = {
      from: `"${emailConfig.from}" <${emailConfig.user}>`,
      to: email,
      subject: "비밀번호 재설정 요청",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">비밀번호 재설정</h2>
          <p>비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #4CAF50;
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 4px;
                      display: inline-block;">
              비밀번호 재설정하기
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            또는 아래 링크를 복사하여 브라우저에 붙여넣으세요:
          </p>
          <p style="color: #007bff; word-break: break-all;">
            ${resetUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            이 링크는 <strong>1시간 동안만 유효</strong>합니다.<br>
            비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하세요.
          </p>
        </div>
      `,
      text: `
        비밀번호 재설정을 요청하셨습니다.

        아래 링크를 클릭하여 비밀번호를 재설정하세요:
        ${resetUrl}

        이 링크는 1시간 동안만 유효합니다.
        비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하세요.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`비밀번호 재설정 이메일 발송 완료: ${email}`);
    return true;
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    throw new Error("이메일 발송에 실패했습니다.");
  }
};

const sendPasswordChangedEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${emailConfig.from}" <${emailConfig.user}>`,
      to: email,
      subject: "비밀번호가 변경되었습니다",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">비밀번호 변경 완료</h2>
          <p>귀하의 계정 비밀번호가 성공적으로 변경되었습니다.</p>
          <p style="color: #666; font-size: 14px;">
            본인이 변경한 것이 아니라면, 즉시 고객센터로 문의해주세요.
          </p>
        </div>
      `,
      text: `
        귀하의 계정 비밀번호가 성공적으로 변경되었습니다.
        본인이 변경한 것이 아니라면, 즉시 고객센터로 문의해주세요.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`비밀번호 변경 알림 이메일 발송 완료: ${email}`);
    return true;
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};

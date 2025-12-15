interface ResetPasswordTemplateProps {
  url: string;
}

export default function ResetPasswordTemplate({
  url,
}: ResetPasswordTemplateProps) {
  return (
    <div>
      <h1>Hi There</h1>
      <p>
        You could reset password by clicking <a href={url}>here</a>
      </p>
    </div>
  );
}

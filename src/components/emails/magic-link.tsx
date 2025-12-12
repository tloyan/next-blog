interface MagicLinkEmailTemplateProps {
  url: string;
}

export default function MagicLinkEmailTemplate({
  url,
}: MagicLinkEmailTemplateProps) {
  return (
    <div>
      <h1>Hi There</h1>
      <p>
        <a href={url}>Click Here</a> to log in to next-blog
      </p>
    </div>
  );
}

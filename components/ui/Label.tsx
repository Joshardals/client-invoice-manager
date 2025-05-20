export function Label(
  Icon: React.ElementType | null,
  text: string,
  required?: boolean
) {
  return (
    <span className="flex items-center">
      {Icon && <Icon className="size-3 xs:size-4 mr-2" />}
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );
}

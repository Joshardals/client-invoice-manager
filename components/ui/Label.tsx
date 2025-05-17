export function Label(
  Icon: React.ElementType | null,
  text: string,
  required?: boolean
) {
  return (
    <span className="flex items-center">
      {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />}
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );
}

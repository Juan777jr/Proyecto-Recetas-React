const Input = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  min,
  max,
  ref,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-stone-800 mb-1"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        className={`w-full border rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-stone-300 focus:ring-amber-500'
        }`}
      />
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
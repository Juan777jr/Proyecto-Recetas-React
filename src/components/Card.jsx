const Card = ({ children, bg = 'bg-white' }) => {
  return (
    <div className={`${bg} p-6 rounded-xl shadow-sm border border-stone-200`}>
      {children}
    </div>
  );
};

export default Card;
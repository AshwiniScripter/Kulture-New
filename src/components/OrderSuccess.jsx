import { useNavigate, useParams } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoCubeOutline, IoHomeOutline } from 'react-icons/io5';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 text-neutral-200 flex items-start justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center">
          <IoCheckmarkCircleOutline className="text-4xl text-green-400" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
            Order Confirmed
          </h1>
          <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">
            Thank you for shopping with Kulture Vintage
          </p>
        </div>

        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Order ID</p>
          <p className="text-xl font-black text-green-400 tracking-widest break-all">{id}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl uppercase transition"
          >
            <IoCubeOutline className="text-sm" />
            Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-[#181818] hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl uppercase transition"
          >
            <IoHomeOutline className="text-sm" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

import OrderSucess from "@/components/ui/Order/OrderSuccess";

export default function () {
  return (
    <>
      <div className="flex flex-col items-center justify-center pb-10 mt-[116px]">
        {/* <HeaderText
          text="Your order has been placed successfully!"
          text2="Order Created Successfully"
        /> */}
        <OrderSucess />
      </div>
    </>
  );
}

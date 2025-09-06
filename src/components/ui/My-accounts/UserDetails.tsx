import UserInfo from "./UserInfo";
import UserAddress from "./UserAddress";
import ChangePassword from "./ChangePassword";
import OrderHistoryPage from "./OrderHistory";
import PushNotificationButton from "@/components/PushNotificationButton";

type Props = {
  activeTab: string;
};

export default function UserDetails({ activeTab }: Props) {
  return (
    <div className="w-full md:w-3/4 bg-white shadow rounded-none p-6">
      {activeTab === "account" && <UserInfo />}
      {activeTab === "address" && <UserAddress />}
      {activeTab === "password" && <ChangePassword />}
      {activeTab === "orders" && (
        <div className="w-[100%] " style={{ padding: "0", margin: "0" }}>
          {" "}
          <OrderHistoryPage />{" "}
        </div>
      )}
      {activeTab === "notifications" && (
        <div>
          <PushNotificationButton />
        </div>
      )}
    </div>
  );
}

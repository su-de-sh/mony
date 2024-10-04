import { CATEGORIES } from "@/constants/categories";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const RecentTransactionWidget = ({ darkMode, transactionForCurrentMonth }) => {
  if (!transactionForCurrentMonth || transactionForCurrentMonth?.length === 0) {
    return null;
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-4 mb-8`}
    >
      <h2
        className={`text-lg font-semibold ${
          darkMode ? "text-orange-400" : "text-orange-600"
        } mb-4`}
      >
        Recent Transactions
      </h2>
      <div className="space-y-4">
        {[...transactionForCurrentMonth]
          .reverse()
          .slice(0, 5)
          .map((transaction) => {
            const categoryInfo = CATEGORIES.find(
              (cat) => cat.name === transaction.category.name
            );
            const Icon = categoryInfo ? categoryInfo.icon : ShoppingBag;
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex justify-between items-center p-4 ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } rounded-xl`}
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{
                      backgroundColor: categoryInfo
                        ? categoryInfo.color
                        : "#ccc",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold ">
                      {transaction.category.name}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold text-lg ${
                    transaction.transactionType === "INCOME"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.transactionType === "INCOME" ? "+" : "-"}$
                  {Number(transaction.amount).toFixed(2)}
                </p>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default RecentTransactionWidget;

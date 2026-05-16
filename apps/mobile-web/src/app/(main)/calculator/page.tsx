"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FeatureTextInput } from "@/components/ui/FeatureTextInput";
import { PlantChipSelector } from "@/components/ui/PlantChipSelector";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { plantOptions, type PlantId } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { CalculationHeroCard } from "@/features/calculator/components/CalculationHeroCard";
import { ExpenseBreakdownCard } from "@/features/calculator/components/ExpenseBreakdownCard";

type Expense = {
  id: string;
  label: string;
  amount: number;
  isCustom?: boolean;
};

function formatCurrency(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function parseNumberInput(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace(".0", "")}jt`;
  }

  return formatCurrency(value);
}

export default function CalculatorPage() {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState<PlantId>("padi");
  const [period, setPeriod] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "seed", label: "Benih", amount: 0 },
    { id: "fertilizer", label: "Pupuk", amount: 0 },
    { id: "pesticide", label: "Pestisida", amount: 0 },
    { id: "labor", label: "Tenaga Kerja", amount: 0 },
  ]);
  const [harvestKg, setHarvestKg] = useState("850");
  const [pricePerKg, setPricePerKg] = useState(8000);
  const [showResult, setShowResult] = useState(false);

  const totalModal = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );
  const revenue =
    (Number(harvestKg.replace(/\D/g, "")) || 0) * pricePerKg;
  const profit = revenue - totalModal;
  const margin = revenue > 0 ? `${Math.round((profit / revenue) * 100)}%` : "0%";
  const selectedPlantLabel =
    plantOptions.find((plant) => plant.id === selectedPlant)?.label ?? "Padi";

  const handleExpenseChange = (index: number, nextAmount: number) => {
    setExpenses((current) =>
      current.map((expense, expenseIndex) =>
        expenseIndex === index ? { ...expense, amount: nextAmount } : expense,
      ),
    );
  };

  const handleExpenseLabelChange = (index: number, nextLabel: string) => {
    setExpenses((current) =>
      current.map((expense, expenseIndex) =>
        expenseIndex === index ? { ...expense, label: nextLabel } : expense,
      ),
    );
  };

  const handleAddExpense = () => {
    setExpenses((current) => [
      ...current,
      {
        id: `custom-expense-${current.length + 1}`,
        label: `Pengeluaran ${current.length - 3}`,
        amount: 0,
        isCustom: true,
      },
    ]);
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }

    router.push(AppRoutes.home);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title={showResult ? "Hasil Kalkulasi" : "Kalkulator Usaha Tani"}
        onBack={handleBack}
      />

      {!showResult ? (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
          <div className="flex flex-1 flex-col gap-[15px] px-[14px] pb-6 pt-5">
            <div className="flex flex-col gap-[10px]">
              <SectionTitle>PILIH KOMODITAS</SectionTitle>
              <PlantChipSelector
                selectedId={selectedPlant}
                onSelect={setSelectedPlant}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>PERIODE</SectionTitle>
              <FeatureTextInput
                placeholder="Tuliskan periode di sini..."
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>MODAL YANG KAMU KELUARKAN</SectionTitle>
              <div className="overflow-hidden rounded-[10px] border border-[#e0e0de] bg-white">
                {expenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#e0e0de] px-[15px] py-[15px] last:border-b-0"
                  >
                    {expense.isCustom ? (
                      <input
                        value={expense.label}
                        onChange={(event) =>
                          handleExpenseLabelChange(index, event.target.value)
                        }
                        placeholder="Nama pengeluaran"
                        className="min-w-0 border-none bg-transparent text-[15px] font-medium leading-[22.5px] text-[#6b6b68] outline-none placeholder:text-[#6b6b68]"
                      />
                    ) : (
                      <span className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                        {expense.label}
                      </span>
                    )}
                    <input
                      value={formatCurrency(expense.amount)}
                      onChange={(event) =>
                        handleExpenseChange(
                          index,
                          parseNumberInput(event.target.value),
                        )
                      }
                      inputMode="numeric"
                      placeholder="Rp 0"
                      className="w-[120px] border-none bg-transparent text-right text-[15px] font-medium leading-[22.5px] text-[#6b6b68] outline-none placeholder:text-[#6b6b68]"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddExpense}
                  className="flex w-full items-center justify-center gap-[5px] px-[15px] py-[15px] text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]"
                >
                  <span className="text-[20px] leading-none">+</span>
                  <span>Tambah Pengeluaran</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle bold>HASIL PANEN</SectionTitle>
              <div className="overflow-hidden rounded-[10px] border border-[#e0e0de] bg-white">
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#e0e0de] px-[15px] py-[15px]">
                  <span className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                    Hasil panen (kg)
                  </span>
                  <input
                    value={harvestKg}
                    onChange={(event) => setHarvestKg(event.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    className="w-[120px] border-none bg-transparent text-right text-[15px] font-medium leading-[22.5px] text-[#6b6b68] outline-none"
                  />
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-[15px] py-[15px]">
                  <span className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                    Harga jual per kg (Rp)
                  </span>
                  <input
                    value={formatCurrency(pricePerKg)}
                    onChange={(event) => setPricePerKg(parseNumberInput(event.target.value))}
                    inputMode="numeric"
                    className="w-[120px] border-none bg-transparent text-right text-[15px] font-medium leading-[22.5px] text-[#6b6b68] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <StickyActionBar>
            <PrimaryButton fullWidth onClick={() => setShowResult(true)}>
              Hitung Sekarang
            </PrimaryButton>
          </StickyActionBar>
        </section>
      ) : (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
          <div className="flex flex-1 flex-col gap-[15px] px-[14px] pb-6 pt-[15px]">
            <CalculationHeroCard
              plantLabel={selectedPlantLabel}
              profit={formatCurrency(profit)}
              modal={formatCompactCurrency(totalModal)}
              revenue={formatCompactCurrency(revenue)}
              margin={margin}
            />

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>MODAL YANG KAMU KELUARKAN</SectionTitle>
              <ExpenseBreakdownCard
                items={expenses.map((expense) => ({
                  label: expense.label,
                  value: formatCurrency(expense.amount),
                }))}
                footerLabel="Total Modal"
                footerValue={formatCurrency(totalModal)}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle bold>HASIL PANEN</SectionTitle>
              <ExpenseBreakdownCard
                items={[
                  { label: "Hasil panen (kg)", value: `${harvestKg || 0} kg` },
                  {
                    label: "Harga jual per kg (Rp)",
                    value: formatCurrency(pricePerKg),
                  },
                ]}
              />
            </div>
          </div>

          <StickyActionBar>
            <div className="grid grid-cols-2 gap-[10px]">
              <PrimaryButton
                fullWidth
                variant="light"
                className="border border-[#c6dfc6] bg-[#ebf5eb] text-[15px] leading-[22.5px] text-[#2d6a2d]"
              >
                Simpan ke Catatan
              </PrimaryButton>
              <PrimaryButton
                fullWidth
                className="text-[15px] leading-[22.5px]"
                onClick={() => setShowResult(false)}
              >
                Hitung Ulang
              </PrimaryButton>
            </div>
          </StickyActionBar>
        </section>
      )}
    </main>
  );
}

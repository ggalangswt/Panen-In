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
import {
  createCalculator,
  type CalculatorRecord,
} from "@/services/panenin-api";
import {
  formatCompactCurrency,
  formatCurrency,
  getCalculatorMetrics,
} from "@/services/display";

type Expense = {
  id: string;
  label: string;
  amount: number;
  isCustom?: boolean;
};

function parseNumberInput(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
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
  const [result, setResult] = useState<CalculatorRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedPlantLabel =
    plantOptions.find((plant) => plant.id === selectedPlant)?.label ?? "Padi";

  const derivedMetrics = useMemo(() => getCalculatorMetrics(result), [result]);

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

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const calculator = await createCalculator({
        musim_tanam: period.trim() || "Musim berjalan",
        jenis_tanaman: selectedPlantLabel,
        item_modal: expenses.map((expense) => ({
          nama: expense.label,
          nilai: expense.amount,
        })),
        hasil_kg: Number(harvestKg || 0),
        harga_per_kg: pricePerKg,
      });

      setResult(calculator);
      setShowResult(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghitung usaha tani.",
      );
    } finally {
      setSubmitting(false);
    }
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

            {errorMessage ? (
              <p className="text-[12px] leading-[18px] text-[#b82c2c]">{errorMessage}</p>
            ) : null}
          </div>

          <StickyActionBar>
            <PrimaryButton fullWidth disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Menghitung..." : "Hitung Sekarang"}
            </PrimaryButton>
          </StickyActionBar>
        </section>
      ) : (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
          <div className="flex flex-1 flex-col gap-[15px] px-[14px] pb-6 pt-[15px]">
            <CalculationHeroCard
              plantLabel={selectedPlantLabel}
              profit={formatCurrency(derivedMetrics.profit)}
              modal={formatCompactCurrency(derivedMetrics.totalModal)}
              revenue={formatCompactCurrency(derivedMetrics.revenue)}
              margin={`${derivedMetrics.marginPercent}%`}
            />

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>MODAL YANG KAMU KELUARKAN</SectionTitle>
              <ExpenseBreakdownCard
                items={expenses.map((expense) => ({
                  label: expense.label,
                  value: formatCurrency(expense.amount),
                }))}
                footerLabel="Total Modal"
                footerValue={formatCurrency(derivedMetrics.totalModal)}
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
                disabled
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

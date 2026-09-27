"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBeis } from "@/lib/beis/context";
import { formatSgd, totalProjectCosts } from "@/lib/beis/calculations";
import { COST_CATEGORIES } from "@/lib/beis/field-config";
import { CurrencyField, Field, PageHeader, SectionCard, TextField, WizardFooter } from "./shared";
import { Plus, Trash2 } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function CostsStep() {
  const { app, update, goNext, goBack, markComplete } = useBeis();
  const costs = app.costs;
  const [newCategory, setNewCategory] = useState(COST_CATEGORIES[0].key);
  const total = totalProjectCosts(costs);

  function addItem() {
    update("costs", [...costs, { id: uid(), categoryKey: newCategory, description: "", amount: "", hasQuotation: false }]);
  }

  function updateItem(id: string, patch: Partial<(typeof costs)[number]>) {
    update("costs", costs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeItem(id: string) {
    update("costs", costs.filter((c) => c.id !== id));
  }

  function handleContinue() {
    markComplete("costs");
    goNext();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-0">
      <PageHeader
        eyebrow="Section 5 of 8"
        title="Project costs"
        description="Add each cost item you expect to incur. The estimated total is calculated automatically as you go."
      />

      <SectionCard title="Add a cost item">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Cost category">
              <Select value={newCategory} onValueChange={(v) => v && setNewCategory(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COST_CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.group} — {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Button onClick={addItem} className="cursor-pointer">
            <Plus className="h-4 w-4" /> Add cost item
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Projected costs" className="mt-6">
        {costs.length === 0 ? (
          <p className="py-8 text-center text-body-sm text-zinc-500">
            No cost items added yet. Use &ldquo;Add a cost item&rdquo; above to build your budget.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Quotation</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="w-56 align-top text-body-sm font-medium text-zinc-700">
                    {COST_CATEGORIES.find((cat) => cat.key === c.categoryKey)?.label}
                  </TableCell>
                  <TableCell className="align-top">
                    <TextField value={c.description} onChange={(v) => updateItem(c.id, { description: v })} placeholder="Describe this cost item" />
                  </TableCell>
                  <TableCell className="w-40 align-top">
                    <CurrencyField value={c.amount} onChange={(v) => updateItem(c.id, { amount: v })} />
                  </TableCell>
                  <TableCell className="w-24 text-center align-top">
                    <Checkbox checked={c.hasQuotation} onCheckedChange={(v) => updateItem(c.id, { hasQuotation: v === true })} aria-label="Has quotation" />
                  </TableCell>
                  <TableCell className="w-10 align-top">
                    <Button variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeItem(c.id)} className="cursor-pointer text-zinc-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-zinc-50">
                <TableCell colSpan={2} className="font-semibold text-zinc-900">Estimated total project costs</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-zinc-900">{formatSgd(total)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <WizardFooter onBack={goBack} onNext={handleContinue} />
    </div>
  );
}

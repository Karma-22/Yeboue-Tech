"use client";

import { useActionState, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { changeMenu, saveCategory, saveItem, seedSampleMenu } from "@/app/app/[estId]/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { FormNotice } from "@/components/ui/form-notice";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Category, Item } from "@/lib/db/types";
import type { UploadedPhoto } from "@/lib/images/resize";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { FormState } from "@/lib/validation/forms";
import { PhotoInput } from "./photo-input";

/* L'éditeur de la carte (ARCHITECTURE.md §6.2) : catégories, articles, photos, ruptures. */

interface MenuEditorProps {
  establishmentId: string;
  categories: Category[];
  items: Item[];
  /** Peut tout modifier (propriétaire, gérant). Sinon, seule la rupture est ouverte. */
  canEdit: boolean;
  /** Peut mettre un article en rupture. */
  canToggle: boolean;
  /** La carte existe aussi en anglais : les champs de traduction s'affichent. */
  english: boolean;
  /** Ce qu'on appelle un article ici : « plat », « service ». */
  itemWord: string;
}

type Editing =
  | { kind: "category"; category: Category | null }
  | { kind: "item"; item: Item | null; categoryId: string }
  | null;

const iconButton =
  "grid size-9 shrink-0 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-fg/7 hover:text-fg disabled:opacity-30";

export function MenuEditor({ establishmentId, categories, items, canEdit, canToggle, english, itemWord }: MenuEditorProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = (change: Parameters<typeof changeMenu>[1]) =>
    start(async () => {
      const result = await changeMenu(establishmentId, change);
      setError(result.ok ? null : (result.message ?? "Cela n'a pas fonctionné."));
    });

  if (categories.length === 0) {
    return (
      <>
        <div className="rounded-lg border border-dashed border-line-strong p-8 text-center">
          <p className="font-display text-xl font-bold">Votre carte est vide.</p>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">
            Commencez par une catégorie (« Plats », « Boissons »…), ou partez d&apos;une carte d&apos;exemple que vous
            modifierez ensuite.
          </p>
          {canEdit && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setEditing({ kind: "category", category: null })}>
                <Plus aria-hidden="true" className="size-4" />
                Créer une catégorie
              </Button>
              <Button
                variant="outline"
                loading={pending}
                onClick={() =>
                  start(async () => {
                    const result = await seedSampleMenu(establishmentId);
                    setError(result.ok ? null : (result.message ?? null));
                  })
                }
              >
                Partir d&apos;une carte d&apos;exemple
              </Button>
            </div>
          )}
          {error && <p className="mt-4 text-sm font-medium text-danger-text">{error}</p>}
        </div>
        {editing?.kind === "category" && (
          <CategoryDialog establishmentId={establishmentId} category={null} english={english} onClose={() => setEditing(null)} />
        )}
      </>
    );
  }

  return (
    <div className={cn("grid gap-6", pending && "opacity-70 transition-opacity")}>
      {error && (
        <p role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text">
          {error}
        </p>
      )}

      {categories.map((category, index) => {
        const inside = items.filter((item) => item.categoryId === category.id);
        return (
          <section key={category.id} className="overflow-hidden rounded-lg border border-line bg-surface-raised">
            <header className="flex items-center gap-1 border-b border-line bg-surface-sunken/60 py-2 pr-2 pl-5">
              <h2 className={cn("min-w-0 flex-1 truncate font-display text-lg font-bold", !category.visible && "text-fg-subtle")}>
                {category.name}
                {!category.visible && <span className="ml-2 text-xs font-semibold">(masquée)</span>}
              </h2>
              {canEdit && (
                <>
                  <button
                    type="button"
                    className={iconButton}
                    disabled={index === 0}
                    aria-label={`Monter ${category.name}`}
                    onClick={() => run({ kind: "category.move", id: category.id, direction: -1 })}
                  >
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={iconButton}
                    disabled={index === categories.length - 1}
                    aria-label={`Descendre ${category.name}`}
                    onClick={() => run({ kind: "category.move", id: category.id, direction: 1 })}
                  >
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={iconButton}
                    aria-label={category.visible ? `Masquer ${category.name}` : `Afficher ${category.name}`}
                    onClick={() => run({ kind: "category.visible", id: category.id, visible: !category.visible })}
                  >
                    {category.visible ? <Eye aria-hidden="true" className="size-4" /> : <EyeOff aria-hidden="true" className="size-4" />}
                  </button>
                  <button
                    type="button"
                    className={iconButton}
                    aria-label={`Renommer ${category.name}`}
                    onClick={() => setEditing({ kind: "category", category })}
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                  </button>
                </>
              )}
            </header>

            <ul>
              {inside.map((item, position) => (
                <li key={item.id} className="flex items-center gap-3 border-b border-line py-2.5 pr-2 pl-5 last:border-b-0">
                  {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.photo.thumb} alt="" className="size-12 shrink-0 rounded-sm object-cover" />
                  ) : (
                    <span className="size-12 shrink-0 rounded-sm border border-dashed border-line-strong" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate font-semibold", !item.available && "text-fg-subtle line-through")}>{item.name}</p>
                    <p className="text-sm text-fg-muted tabular-nums">
                      {item.price !== null ? formatPrice(item.price) : item.note || "Sans prix"}
                      {!item.available && <span className="ml-2 font-semibold text-warning-text">En rupture</span>}
                    </p>
                  </div>
                  {canToggle && (
                    <Switch
                      checked={item.available}
                      aria-label={`${item.name} : disponible`}
                      onCheckedChange={(available) => run({ kind: "item.available", id: item.id, available })}
                    />
                  )}
                  {canEdit && (
                    <>
                      <span className="hidden sm:flex">
                        <button
                          type="button"
                          className={iconButton}
                          disabled={position === 0}
                          aria-label={`Monter ${item.name}`}
                          onClick={() => run({ kind: "item.move", id: item.id, direction: -1 })}
                        >
                          <ArrowUp aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          type="button"
                          className={iconButton}
                          disabled={position === inside.length - 1}
                          aria-label={`Descendre ${item.name}`}
                          onClick={() => run({ kind: "item.move", id: item.id, direction: 1 })}
                        >
                          <ArrowDown aria-hidden="true" className="size-4" />
                        </button>
                      </span>
                      <button
                        type="button"
                        className={iconButton}
                        aria-label={`Modifier ${item.name}`}
                        onClick={() => setEditing({ kind: "item", item, categoryId: category.id })}
                      >
                        <Pencil aria-hidden="true" className="size-4" />
                      </button>
                    </>
                  )}
                </li>
              ))}
              {inside.length === 0 && <li className="px-5 py-4 text-sm text-fg-muted">Rien dans cette catégorie pour l&apos;instant.</li>}
            </ul>

            {canEdit && (
              <button
                type="button"
                onClick={() => setEditing({ kind: "item", item: null, categoryId: category.id })}
                className="flex h-12 w-full items-center gap-2 border-t border-line px-5 text-sm font-semibold text-accent-text hover:bg-fg/4"
              >
                <Plus aria-hidden="true" className="size-4" />
                Ajouter un {itemWord}
              </button>
            )}
          </section>
        );
      })}

      {canEdit && (
        <Button variant="outline" className="justify-self-start" onClick={() => setEditing({ kind: "category", category: null })}>
          <Plus aria-hidden="true" className="size-4" />
          Ajouter une catégorie
        </Button>
      )}

      {editing?.kind === "category" && (
        <CategoryDialog
          establishmentId={establishmentId}
          category={editing.category}
          english={english}
          onClose={() => setEditing(null)}
          onDelete={
            editing.category
              ? () => {
                  run({ kind: "category.delete", id: editing.category!.id });
                  setEditing(null);
                }
              : undefined
          }
        />
      )}
      {editing?.kind === "item" && (
        <ItemDialog
          establishmentId={establishmentId}
          item={editing.item}
          categoryId={editing.categoryId}
          categories={categories}
          english={english}
          itemWord={itemWord}
          onClose={() => setEditing(null)}
          onDelete={
            editing.item
              ? () => {
                  run({ kind: "item.delete", id: editing.item!.id });
                  setEditing(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

/** Lance l'action d'un formulaire, et referme la fenêtre si elle a réussi. */
function useDialogAction(action: (previous: FormState, formData: FormData) => Promise<FormState>, onClose: () => void) {
  return useActionState(async (previous: FormState, formData: FormData) => {
    const result = await action(previous, formData);
    if (result.ok) onClose();
    return result;
  }, {});
}

function CategoryDialog({
  establishmentId,
  category,
  english,
  onClose,
  onDelete,
}: {
  establishmentId: string;
  category: Category | null;
  english: boolean;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [state, action, pending] = useDialogAction(saveCategory.bind(null, establishmentId, category?.id ?? null), onClose);
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>{category ? "Renommer la catégorie" : "Nouvelle catégorie"}</DialogTitle>
        <DialogDescription>Par exemple « Entrées », « Grillades », « Boissons ».</DialogDescription>
        <form action={action} className="grid gap-4" noValidate>
          <Field label="Nom" error={state.errors?.name}>
            <Input name="name" defaultValue={category?.name} autoFocus required />
          </Field>
          {english && (
            <Field label="Nom en anglais" optional error={state.errors?.nameEn}>
              <Input name="nameEn" defaultValue={category?.nameEn} />
            </Field>
          )}
          <FormNotice state={state} />
          <DialogFooter>
            {onDelete && (
              <Button
                variant="ghost"
                className="text-danger-text sm:mr-auto"
                onClick={() => {
                  if (window.confirm("Supprimer cette catégorie et tout ce qu'elle contient ?")) onDelete();
                }}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Supprimer
              </Button>
            )}
            <Button type="submit" loading={pending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ItemDialog({
  establishmentId,
  item,
  categoryId,
  categories,
  english,
  itemWord,
  onClose,
  onDelete,
}: {
  establishmentId: string;
  item: Item | null;
  categoryId: string;
  categories: Category[];
  english: boolean;
  itemWord: string;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [state, action, pending] = useDialogAction(saveItem.bind(null, establishmentId, item?.id ?? null), onClose);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(item?.photo ?? null);
  const values = state.values ?? {};

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>{item ? `Modifier « ${item.name} »` : `Nouveau ${itemWord}`}</DialogTitle>
        <DialogDescription className="sr-only">Le nom, le prix, la photo et la description.</DialogDescription>
        <form action={action} className="grid gap-4" noValidate>
          <input type="hidden" name="photoThumb" value={photo?.thumb ?? ""} />
          <input type="hidden" name="photoLarge" value={photo?.large ?? ""} />
          <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
            <PhotoInput
              establishmentId={establishmentId}
              kind="item"
              value={photo}
              onChange={setPhoto}
              label="Ajouter une photo"
            />
            <div className="grid content-start gap-4">
              <Field label="Nom" error={state.errors?.name}>
                <Input name="name" defaultValue={values.name ?? item?.name} required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (F CFA)" hint="Vide = sans prix." error={state.errors?.price}>
                  <Input
                    name="price"
                    inputMode="numeric"
                    placeholder="3500"
                    defaultValue={values.price ?? (item?.price ?? "")}
                  />
                </Field>
                <Field label="Mention" hint="« Gratuit », « Inclus »…" error={state.errors?.note}>
                  <Input name="note" maxLength={20} defaultValue={values.note ?? item?.note} />
                </Field>
              </div>
            </div>
          </div>
          <Field label="Description" optional error={state.errors?.description}>
            <Textarea name="description" rows={2} defaultValue={values.description ?? item?.description} />
          </Field>
          <Field label="Catégorie" error={state.errors?.categoryId}>
            <Select name="categoryId" defaultValue={values.categoryId ?? item?.categoryId ?? categoryId}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          {english && (
            <div className="grid gap-4 rounded-md bg-surface-sunken p-4">
              <Field label="Nom en anglais" optional error={state.errors?.nameEn}>
                <Input name="nameEn" defaultValue={values.nameEn ?? item?.nameEn} />
              </Field>
              <Field label="Description en anglais" optional error={state.errors?.descriptionEn}>
                <Textarea name="descriptionEn" rows={2} defaultValue={values.descriptionEn ?? item?.descriptionEn} />
              </Field>
            </div>
          )}
          <FormNotice state={state} />
          <DialogFooter>
            {onDelete && (
              <Button
                variant="ghost"
                className="text-danger-text sm:mr-auto"
                onClick={() => {
                  if (window.confirm("Supprimer cet article ?")) onDelete();
                }}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Supprimer
              </Button>
            )}
            <Button type="submit" loading={pending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

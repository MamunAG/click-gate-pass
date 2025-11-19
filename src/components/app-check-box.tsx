/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormField, FormItem } from './ui/form'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'

type props = {
    form: any,
    name: string,
    text?: string,
    description?: string,
}

export default function AppCheckBox({ form, name, text, description }: props) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
                return (
                    <FormItem className="flex flex-row items-center gap-2">
                        <FormControl className="w-full">
                            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                <Checkbox
                                    defaultChecked
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    name={field.name}
                                    ref={field.ref}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <div className="grid gap-1.5 font-normal">
                                    <p className="text-sm leading-none font-semibold">
                                        {text ?? 'Is Active'}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {description ?? 'This item will show other pages when it checked.'}
                                    </p>
                                </div>
                            </Label>
                        </FormControl>
                    </FormItem>
                )
            }}
        />
    )
}

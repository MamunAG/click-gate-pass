
{/* Amount */ }
{/* <AppInput form={form} name={"Amount"} text={"Amount"} align="horizontal" labelCSS="w-32"
                                    onBlur={() => {
                                        const items = form.getValues("GatepassDetails");
                                        items.forEach((_, index) => {
                                            form.setValue(`GatepassDetails.${index}.DebitAmount`, form.getValues(`GatepassDetails.${index}.IsDebitAccount`) ? form.getValues("Amount") : 0);
                                            form.setValue(`GatepassDetails.${index}.CreditAmount`, form.getValues(`GatepassDetails.${index}.IsDebitAccount`) ? 0 : form.getValues("Amount"));
                                        });

                                    }}
                                /> */}
{/* PaymentMethod */ }
{/* <AppFormCombobox
                                    text="Payment Method"
                                    textFieldName="PaymentMethodName"
                                    valueFieldName="PaymentMethodId"
                                    form={form}
                                    selectItems={PaymentMethods}
                                    onSelectCommandItem={() => {
                                        if (form.getValues("PaymentMethodName") == 'Cheque') {
                                            setChequeInputVisible(true);
                                            //================================
                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        } else if (form.getValues("PaymentMethodName") == 'TT') {
                                            setTTInputVisible(true);
                                            //==================================
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                        } else if (form.getValues("PaymentMethodName") == 'LC') {
                                            setBBLCInputVisible(true);
                                            //================================
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        } else {
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        }
                                    }}
                                    onClickXButton={() => {
                                        setChequeInputVisible(false);
                                        form.setValue("ChequeNumber", '')
                                        form.setValue("ChequeDate", undefined)
                                        form.setValue("bb_lc_no", '')
                                    }}
                                    align="horizontal" labelCSS="w-32"
                                /> */}
{/* <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", chequeInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"ChequeNumber"} text={"Cheque No"} className="flex-1" />
                                    <div className="min-w-40">
                                        <AppDate form={form} name={"ChequeDate"} text={"Cheque Date*"} />
                                    </div>
                                </div>
                                <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", bblcInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"bb_lc_no"} text={"BB L/C No"} className="flex-1" />
                                </div>
                                <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", ttInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"tt_no"} text={"TT No"} className="flex-1" />
                                </div> */}

// <AppFormCombobox
//     text="Master L/C"
//     textFieldName="master_lc_number"
//     valueFieldName="master_lc_id"
//     form={form}
//     selectItems={masterLCs}
//     align="horizontal"
//     labelCSS="w-32"
// />


{/* <TableCell className="text-center">
                                                <FormField
                                                    control={control}
                                                    name={`GatepassDetails.${index}.IsDebitAccount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex gap-2 justify-center items-center">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        name={field.name}
                                                                        ref={field.ref}
                                                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className=" text-black dark:text-white">{field.value ? 'Yes' : 'No'}</FormLabel>
                                                                </div>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell> */}
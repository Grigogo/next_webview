"use client";

import {
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { FC, useState } from "react";
import { z } from "zod";
import validator from 'validator'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  clientId: z.string().refine(validator.isMobilePhone, "Введите корректный номер телефона"),

  clientSecret: z
    .string()
    .min(4, "Пин 4 цифры!")
    .max(4, "Пин 4 цифры!")
    .regex(new RegExp("^[0-9]{4}$")),

  confirmClientSecret: z
    .string()
    .min(4, "Пин 4 цифры!")
    .max(4, "Пин 4 цифры!")
    .regex(new RegExp("^[0-9]{4}$"), "Только цифры"),

  accepted: z.literal(true, {
    errorMap: () => ({
      message: "Примите политику"
    })
  })
}).superRefine((data, ctx) => {
  if (data.clientSecret !== data.confirmClientSecret) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Пины не совпадают",
      path: ["confirmClientSecret"]
    });
  }
});

type InputType = z.infer<typeof FormSchema>

const SignUpForm: FC = () => {
  const { register, handleSubmit, reset, formState:{errors} } = useForm<InputType>({
    resolver: zodResolver(FormSchema)
  })
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(saveUser)} className="flex flex-col gap-3 w-full md:w-[320px] p-2 shadow">
      <Input
        errorMessage={errors.clientId?.message}
        isInvalid={!!errors.clientId}
        {...register("clientId")}
        label="Номер телефона"
        startContent={<PhoneIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.clientSecret?.message}
        isInvalid={!!errors.clientSecret}
        {...register("clientSecret")}
        label="Пин"
        type={isVisiblePass ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisiblePass ? (
            <EyeSlashIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          ) : (
            <EyeIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          )
        }
      />
      <Input
        errorMessage={errors.confirmClientSecret?.message}
        isInvalid={!!errors.confirmClientSecret}
        {...register("confirmClientSecret")}
        label="подтвердите пин"
        type={isVisiblePass ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisiblePass ? (
            <EyeSlashIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          ) : (
            <EyeIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisiblePass}
            />
          )
        }
      />
      <Checkbox {...register("accepted")} className="col-span-2">
        Принять <Link href="/terms">политику</Link> конфиденциальности
      </Checkbox>
      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}
      <div className="flex justify-center col-span-2">
        <Button type="submit" className="w-full md:w-40" color="primary">
          Отправить
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;

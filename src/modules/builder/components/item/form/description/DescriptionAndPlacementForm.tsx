import type { JSX } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack } from '@mui/material';

import { DescriptionForm } from './DescriptionForm';
import DescriptionPlacementForm from './DescriptionPlacementForm';

type DescriptionAndPlacementFormProps = {
  id?: string;
};

export function DescriptionAndPlacementForm({
  id,
}: Readonly<DescriptionAndPlacementFormProps>): JSX.Element {
  const { control } = useFormContext<{
    description: string;
  }>();
  return (
    <Stack spacing={2}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <DescriptionForm
            id={id}
            // ref={descriptionRegister.ref}
            value={field.value}
            onChange={(v) => field.onChange(v)}
          />
        )}
      />
      <DescriptionPlacementForm />
    </Stack>
  );
}

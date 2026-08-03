import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';

type SecurityCodeFormProps = {
  label?: string;
  submitLabel: string;
  isLoading?: boolean;
  onSubmit: (code: string) => Promise<void>;
};

export function SecurityCodeForm({
  label = 'Codigo de 6 digitos',
  submitLabel,
  isLoading = false,
  onSubmit,
}: SecurityCodeFormProps) {
  const [code, setCode] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(code);
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <TextField
        label={label}
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        pattern="\d{6}"
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
        placeholder="123456"
        required
      />
      <Button type="submit" disabled={isLoading || code.length !== 6}>
        {isLoading ? 'Validando...' : submitLabel}
      </Button>
    </form>
  );
}

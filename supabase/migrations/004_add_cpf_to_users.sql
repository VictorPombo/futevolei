-- Migration para adicionar CPF e obrigar telefone
ALTER TABLE public.users ADD COLUMN cpf text UNIQUE;

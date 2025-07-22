-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER,
    "designation_id" INTEGER,
    "company" TEXT,
    "employee_type" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "image" TEXT,
    "status" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_frequencies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "kpi_frequencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_periods" (
    "id" SERIAL NOT NULL,
    "frequency_id" INTEGER,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "week" INTEGER,
    "quarter" INTEGER,

    CONSTRAINT "kpi_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_values" (
    "id" SERIAL NOT NULL,
    "kpi_id" INTEGER,
    "employee_id" INTEGER,
    "period_id" INTEGER,
    "value_achieved" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "kpi_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "frequency_id" INTEGER,
    "target" DOUBLE PRECISION,
    "threshold_red_min" DOUBLE PRECISION,
    "threshold_red_max" DOUBLE PRECISION,
    "threshold_amber_min" DOUBLE PRECISION,
    "threshold_amber_max" DOUBLE PRECISION,
    "threshold_green_min" DOUBLE PRECISION,
    "threshold_green_max" DOUBLE PRECISION,
    "designation_id" INTEGER,

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_department_name" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_designation" ON "designations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_frequencies_name_key" ON "kpi_frequencies"("name");

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpi_periods" ADD CONSTRAINT "kpi_periods_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "kpi_frequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpi_values" ADD CONSTRAINT "kpi_values_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpi_values" ADD CONSTRAINT "kpi_values_kpi_id_fkey" FOREIGN KEY ("kpi_id") REFERENCES "kpis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpi_values" ADD CONSTRAINT "kpi_values_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "kpi_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "kpi_frequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

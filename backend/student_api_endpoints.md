# 📘 Student API Endpoints

## 1. `GET /api/student/exams`

**Description:**  
Get all ongoing exams (course + batch matched).

**Query Parameters:**
- `studentId` (string): MongoDB ObjectId of the student

**Response:**
```ts
{
  exams: [
    {
      _id,
      title,
      startTime,
      endTime,
      course: { _id, name, code },
      batch: { _id, name }
    },
    ...
  ]
}
```

---

## 2. `GET /api/student/pending-evaluations`

**Description:**  
Get all pending evaluations assigned to the student.

**Query Parameters:**
- `studentId` (string): Logged-in student's `_id`

**Response:**
```ts
{
  pendingEvaluations: [
    {
      _id,
      exam: { title, startTime, endTime },
      evaluatee: { name, email },
      marks: [],
      feedback: "",
      ...
    },
    ...
  ]
}
```

---

## 3. `POST /api/student/evaluate`

**Description:**  
Submit evaluation for a peer.

**Request Body:**
```ts
{
  evaluationId: string,
  marks: number[],          // one mark per question
  feedback: string
}
```

**Response:**
```ts
{ message: "Evaluation submitted successfully" }
```

---

## 4. `GET /api/student/results`

**Description:**  
Get results for all exams evaluated for the logged-in student.

**Query Parameters:**
- `studentId` (string)

**Response:**
```ts
{
  results: [
    {
      exam: { title, startTime, endTime },
      evaluator: { name, email },
      marks: number[],
      feedback: string
    },
    ...
  ]
}
```
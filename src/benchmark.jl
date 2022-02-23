# ## Benchmark

# This tutorial follows closely the tutorial [OptimizationProblems.jl](https://juliasmoothoptimizers.github.io/OptimizationProblems.jl/dev/benchmark/).
# We show how to use [SolverBenchmark.jl](https://juliasmoothoptimizers.github.io/SolverBenchmark.jl) to benchmark solvers that take a NLPStopping as input.

using LinearAlgebra, NLPModels, Stopping
using JSOSolvers, StoppingInterface
using DataFrames, Printf, SolverBenchmark
using ADNLPModels, OptimizationProblems

# We select the problems from [OptimizationProblems.jl](https://juliasmoothoptimizers.github.io/OptimizationProblems.jl) that are unconstrained and scalable.

df = OptimizationProblems.meta
names_pb_vars = df[(df.variable_nvar .== true) .& (df.ncon .== 0), :name]

ad_problems = (
  OptimizationProblems.ADNLPProblems.eval(Symbol(problem))(n = 31) for problem ∈ names_pb_vars
)

# Then, we prepare the solvers we will benchmark. 
# Here, we use [JSOSolvers.jl](https://github.com/JuliaSmoothOptimizers/JSOSolvers.jl) that are made Stopping-compatible using [StoppingInterface.jl](https://github.com/SolverStoppingJulia/StoppingInterface.jl).

solvers = Dict(
  :lbfgs => model -> stopping_to_stats(StoppingInterface.lbfgs(NLPStopping(model); mem=5, atol=1e-5, rtol=0.0, max_time = 5.)),
  :trunk => model -> stopping_to_stats(StoppingInterface.trunk(NLPStopping(model); atol=1e-5, rtol=0.0, max_time = 5.)),
)

# The main function used from [SolverBenchmark.jl](https://juliasmoothoptimizers.github.io/SolverBenchmark.jl).

stats = bmark_solvers(
  solvers, ad_problems
)

# The output of `bmark_solvers` can then be analyzed for the results as a table

cols = [:id, :name, :nvar, :objective, :dual_feas, :neval_obj, :neval_grad, :neval_hess, :iter, :elapsed_time, :status]
header = Dict(
  :nvar => "n",
  :objective => "f(x)",
  :dual_feas => "‖∇f(x)‖",
  :neval_obj => "# f",
  :neval_grad => "# ∇f",
  :neval_hess => "# ∇²f",
  :elapsed_time => "t",
)

for solver ∈ keys(solvers)
  pretty_stats(stats[solver][!, cols], hdr_override=header)
end

first_order(df) = df.status .== :first_order
unbounded(df) = df.status .== :unbounded
solved(df) = first_order(df) .| unbounded(df)
costnames = ["time", "obj + grad + hess"]
costs = [
  df -> .!solved(df) .* Inf .+ df.elapsed_time,
  df -> .!solved(df) .* Inf .+ df.neval_obj .+ df.neval_grad .+ df.neval_hess,
]

# or as a performance profile

using Plots
gr()

profile_solvers(stats, costs, costnames)
